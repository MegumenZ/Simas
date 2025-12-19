from locust import HttpUser, task, between

class KomasSimasUser(HttpUser):
    wait_time = between(1, 5)

    @task(8)
    def visit_homepage(self):
        self.client.get("/")

    @task(1)
    def attack_sqli(self):
        with self.client.get("/?id=1 OR 1=1", catch_response=True) as response:
            if response.status_code == 403:
                response.success()
            elif response.status_code == 200:
                response.failure("BAHAYA! SQL Injection Tembus!")

    @task(1)
    def attack_xss(self):
        with self.client.get("/?search=<script>alert(1)</script>", catch_response=True) as response:
            if response.status_code == 403:
                response.success()
            elif response.status_code == 200:
                response.failure("BAHAYA! XSS Tembus!")