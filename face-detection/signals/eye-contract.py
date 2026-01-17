# signals/eye_contact.py
def eye_contact_score(face_landmarks):
    left_eye = face_landmarks.landmark[33]
    right_eye = face_landmarks.landmark[263]

    eye_center_x = (left_eye.x + right_eye.x) / 2
    distance = abs(eye_center_x - 0.5)

    return max(0, 1 - distance * 4)
