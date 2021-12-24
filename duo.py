#
# Duo HOTP CLI tool
#
# Based off of simonseo/nyuad-spammer

from base64 import b32encode, b64decode
from os.path import dirname, join, abspath
from urllib import parse
from sys import stderr
from requests import post
import pyotp
import argparse
import json


class HOTP:
    FILE = "./secrets.json"

    def __init__(self, key, count):
        self.secret = key
        self.count = count
        self.hotp = pyotp.HOTP(b32encode(self.secret.encode("utf-8")))

    @classmethod
    def from_file(cls, file=None):
        file = file or cls.FILE

        with open(file, "r") as f:
            secrets = json.load(f)

        return cls(secrets["hotp_secret"], secrets["count"])

    def as_dict(self) -> dict:
        return {"hotp_secret": self.secret, "count": self.count}

    def save(self, file=None):
        secrets = self.as_dict()

        file = file or self.FILE

        with open(file, "w") as f:
            json.dump(secrets, f)

    def generate(self) -> int:
        """Generates a HOTP code"""
        code = self.hotp.at(self.count)
        self.count += 1
        return code


def qr_to_activation(qr_url):
    # Create request URL
    query = parse.parse_qs(parse.urlparse(qr_url).query)
    data = parse.unquote(query['value'][0])

    code, hostb64, *_ = data.split("-")

    # first half of value is the activation code
    code = code.replace("duo://", "")  

    # Same as "api-e4c9863e.duosecurity.com"
    host = b64decode(hostb64 + "=" * (-len(hostb64) % 4))      

    activation_url = "https://{host}/push/v2/activation/{code}".format(
        host=host.decode("utf-8"), code=code
    )

    return activation_url


def activate_device(activation_url):
    """Activates through activation url and returns HOTP key"""
    res = json.loads(post(activation_url))

    if res["stat"] == "FAIL":
        raise ValueError(f"The given URL is invalid. The server returned {res.message}")

    return res["response"]["hotp_secret"]

def main():
    parser = argparse.ArgumentParser(description="Simple wrapper over Duo HOTP")
    parser.add_argument("-qr", "--qr-code", nargs="?", default=None)
    args = parser.parse_args()

    if args.qr_code:
        activation = qr_to_activation(args.qr_code)
        secret = activate_device(activation)
        hotp = HOTP(secret, 0)
    else:
        try:
            hotp = HOTP.from_file()
        except FileNotFoundError:
            print("Secret not found! Load a qr code.", file=stderr)
            exit(-1)

    print(hotp.generate())
    hotp.save()


if __name__ == "__main__":
    main()
