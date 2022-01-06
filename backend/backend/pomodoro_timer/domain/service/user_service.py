import hashlib


def create_user_id(gmail_address: str) -> str:
    return _create_hash_data(gmail_address)


def _create_hash_data(gmail_address: str) -> str:
    return hashlib.sha256(gmail_address.encode("utf-8")).hexdigest()
