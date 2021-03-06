import random
import os
from asyncio import subprocess
from dataclasses import dataclass, asdict
from pathlib import Path
import time
from deploy_constants import (
    GOOGLE_CLIENT_ID,
    REGION,
    ACCESS_KEY,
    S3_BUCKET_NAME,
    SECRET,
    INSTANCE_ID,
    CONTAINER_NAME,
    PATH_TO_WORKSPACE,
    PROJECT_NAME,
    REPOSITORY_URL,
    PROCESS_NAME,
    ITEMS,
    DISTRIBUTION_ID,
    BACKEND_URL,
)
import boto3
import subprocess

ACCEPTABLE_ERROR = "Already up to date.\n"
S3_FILE_SEP = "/"


class Boto3Command:
    def __init__(self, commands: list[str]):
        self._ssm = boto3.client(
            "ssm",
            region_name=REGION,
            aws_access_key_id=ACCESS_KEY,
            aws_secret_access_key=SECRET,
        )
        self._commands = commands

    def execute(self) -> str:
        print("Executing Following Commands")
        for command in self._commands:
            print(command)
        result = self._ssm.send_command(
            InstanceIds=[INSTANCE_ID],
            DocumentName="AWS-RunShellScript",
            Parameters={"commands": self._commands},
        )
        command_id = result["Command"]["CommandId"]
        time.sleep(2)
        output = self._ssm.get_command_invocation(
            CommandId=command_id, InstanceId=INSTANCE_ID,
        )
        stdout = output["StandardOutputContent"]
        stderr = output["StandardErrorContent"]
        if len(stderr) != 0:
            if stdout != ACCEPTABLE_ERROR:
                raise ValueError(f"Command Failed with error:\n{stderr}")
        return stdout


class DockerCommand(Boto3Command):
    def __init__(self, commands: list[str]):
        self.validate_commands(commands)
        sub_commands = "; ".join(commands)
        commands = [f"docker exec {CONTAINER_NAME} bash -c '{sub_commands}'"]
        super().__init__(commands)

    @staticmethod
    def validate_commands(commands: list[str]):
        for command in commands:
            assert (
                "'" not in command
            ), "Single quotation can not be included in docker commands"


def setup_dir():
    commands = [f"cd {PATH_TO_WORKSPACE}", "ls"]
    ssh_command = DockerCommand(commands)
    result = ssh_command.execute()
    dirs = result.split("\n")
    if not PROJECT_NAME in dirs:
        commands = [
            f"cd {PATH_TO_WORKSPACE}",
            f"git clone {REPOSITORY_URL}",
        ]
        DockerCommand(commands).execute()


def clean_process():
    commands = ["ps -A"]
    ps_result = DockerCommand(commands).execute()
    rows = ps_result.split("\n")
    process_names = [row.split()[-1] for row in rows if len(row) > 0]
    if PROCESS_NAME in process_names:
        commands = [f"pkill -f {PROCESS_NAME}"]
        DockerCommand(commands).execute()


def update():
    commands = [
        f"cd {PATH_TO_WORKSPACE}",
        f"cd {PROJECT_NAME}",
        "git pull origin master",
    ]
    DockerCommand(commands).execute()


def runserver():
    commands = [
        f"cd {PATH_TO_WORKSPACE}",
        f"cd {PROJECT_NAME}",
        "cd backend/backend",
        "nohup python3.9 manage.py runserver 0.0.0.0:8000 &",
    ]
    DockerCommand(commands).execute()


@dataclass
class EnvironmentVariables:
    REACT_APP_GOOGLE_CLIENT_ID: str = GOOGLE_CLIENT_ID
    REACT_APP_BACKEND_URL: str = BACKEND_URL

    def as_env(self) -> dict[str, str]:
        env = os.environ.copy()
        env.update(asdict(self))
        return env


def build_frontend():
    env = EnvironmentVariables().as_env()
    front_end_root = Path().joinpath("frontend")
    subprocess.run("npm run build", shell=True, env=env, cwd=front_end_root)


def create_bucket():
    s3 = boto3.resource(
        "s3",
        region_name=REGION,
        aws_access_key_id=ACCESS_KEY,
        aws_secret_access_key=SECRET,
    )
    bucket = s3.Bucket(S3_BUCKET_NAME)
    return bucket


def delete_to_s3(bucket):
    s3_objects = list(bucket.objects.all())
    for s3_object in s3_objects:
        s3_object.delete()
        print(f"deleting file: {s3_object}")


def upload_to_s3(bucket):
    extention_map = {
        ".json": "application/json",
        ".html": "text/html",
        ".txt": "text/plain",
        ".css": "text/css",
        ".map": "binary/octet-stream",
        ".js": "application/javascript",
        ".png": "image/png",
        ".jpeg": "image/jpeg",
        ".jpg": "image/jpeg",
        ".wav": "audio/wav",
    }
    build_root = Path().joinpath("frontend", "build").resolve()
    for path in build_root.glob("**/*"):
        if path.is_file():
            rel_path = path.relative_to(build_root)
            str_path = S3_FILE_SEP.join(str(rel_path).split(os.sep))
            extention = path.suffix
            if extention in extention_map:
                content_type = extention_map[extention]
            else:
                raise ValueError(f"Unexpected Extention: {extention}")
            print(f"uploading file: {str(path)} to {str_path}")
            bucket.upload_file(
                str(path), str_path, ExtraArgs={"ContentType": content_type}
            )


def unique_string(prefix="cli"):
    """borrowed from aws-cli/awscli/customizations/cloudfront.py"""
    return "%s-%s-%s" % (prefix, int(time.time()), random.randint(1, 1000000))


def invalidate_cloudfront_cache():
    client = boto3.client(
        "cloudfront",
        region_name=REGION,
        aws_access_key_id=ACCESS_KEY,
        aws_secret_access_key=SECRET,
    )
    res = client.create_invalidation(
        DistributionId=DISTRIBUTION_ID,
        InvalidationBatch={
            "Paths": {"Quantity": len(ITEMS), "Items": ITEMS,},
            "CallerReference": unique_string(),
        },
    )
    print(res)


def main():
    setup_dir()
    clean_process()
    update()
    runserver()
    build_frontend()
    bucket = create_bucket()
    delete_to_s3(bucket)
    upload_to_s3(bucket)
    invalidate_cloudfront_cache()


if __name__ == "__main__":
    main()
