"""
Pure-Python Isolation Forest (no scikit-learn / scipy dependency).

Behaviorally mirrors sklearn.ensemble.IsolationForest for the single-feature
case used by SpendSignature's anomaly detector:
  - fits `n_estimators` random trees on the training sample
  - scores a candidate point by its average path length
  - flags it as an anomaly when its score is below the contamination quantile
    of the training scores (same contract as sklearn's predict() == -1).
"""

import random
import math


def _c(n):
    """Average path length of an unsuccessful search in a BST (sklearn's c(n))."""
    if n <= 1:
        return 0.0
    return 2.0 * (math.log(n - 1) + 0.5772156649) - 2.0 * (n - 1) / n


class _IsolationTree:
    __slots__ = ("split_value", "size", "left", "right")

    def __init__(self):
        self.split_value = None
        self.size = 0
        self.left = None
        self.right = None


def _build_tree(X, rng, height, height_limit):
    n = len(X)
    node = _IsolationTree()
    node.size = n
    if n <= 1 or height >= height_limit:
        return node

    lo = min(X)
    hi = max(X)
    if hi <= lo:  # all identical values -> cannot split
        return node

    split = rng.uniform(lo, hi)
    left = [x for x in X if x < split]
    right = [x for x in X if x >= split]
    if not left or not right:
        return node

    node.split_value = split
    node.left = _build_tree(left, rng, height + 1, height_limit)
    node.right = _build_tree(right, rng, height + 1, height_limit)
    return node


def _path_length(x, node, height):
    if node.split_value is None:
        return height + _c(node.size)
    if x < node.split_value:
        return _path_length(x, node.left, height + 1)
    return _path_length(x, node.right, height + 1)


class IsolationForest:
    """Drop-in replacement for sklearn's IsolationForest (1-D case)."""

    def __init__(self, n_estimators=100, contamination=0.05, random_state=42):
        self.n_estimators = n_estimators
        self.contamination = contamination
        self.random_state = random_state
        self._trees = []
        self._threshold = None
        self._n = 0

    def fit(self, X):
        X = [float(x) for x in X]
        self._n = len(X)
        rng = random.Random(self.random_state)
        height_limit = math.ceil(math.log2(max(2, self._n)))
        self._trees = [
            _build_tree(X, rng, 0, height_limit)
            for _ in range(self.n_estimators)
        ]
        # threshold = lower contamination quantile of training path lengths
        scores = sorted(self._score_point(x) for x in X)
        idx = int(self.contamination * len(scores))
        idx = min(max(idx, 0), len(scores) - 1)
        self._threshold = scores[idx]
        return self

    def _score_point(self, x):
        avg_path = (
            sum(_path_length(x, t, 0) for t in self._trees) / self.n_estimators
        )
        return avg_path  # lower path length = more anomalous

    def predict(self, X):
        X = [float(x) for x in X]
        return [self._flag(x) for x in X]

    def _flag(self, x):
        score = self._score_point(x)
        # anomaly = path length at or below the contamination threshold
        return -1 if score <= self._threshold else 1
