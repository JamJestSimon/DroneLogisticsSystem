package pl.edu.wat.uavlogistics.backend

import io.ktor.client.request.get
import io.ktor.http.HttpStatusCode
import io.ktor.server.testing.testApplication
import org.junit.jupiter.api.Test
import kotlin.test.assertEquals

class ApplicationTest {
    @Test
    fun `health route responds successfully`() = testApplication {
        application {
            moduleWithDatabase(h2Config())
        }

        val response = client.get("/health")

        assertEquals(HttpStatusCode.OK, response.status)
    }
}
