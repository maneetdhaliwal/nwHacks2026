from detectors.face import get_face_landmarks
from signals.eye_contact import eye_contact_score
from signals.head_movement import HeadMovementTracker

head_tracker = HeadMovementTracker()

if face_landmarks:
    eye_score = eye_contact_score(face_landmarks)
    head_motion = head_tracker.update(face_landmarks)