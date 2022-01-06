from dataclasses import dataclass
import json

from django.http.response import HttpResponse

# TODO HttpResponseのラッピング処理
@dataclass
class Response:
    status_code: int
    data: dict

    def create_response(self):
        response = {"statusCode": self.status_code, "data": self.data}
        return HttpResponse(json.dumps(response, ensure_ascii=False))
