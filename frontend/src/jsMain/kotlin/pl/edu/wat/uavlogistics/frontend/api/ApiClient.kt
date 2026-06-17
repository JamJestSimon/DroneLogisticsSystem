package pl.edu.wat.uavlogistics.frontend.api

import kotlinx.browser.window
import kotlinx.coroutines.await
import org.w3c.fetch.RequestInit
import kotlin.js.JSON

object ApiClient {
    suspend fun request(
        backendUrl: String,
        path: String,
        method: String = "GET",
        body: String? = null,
        admin: Boolean = false,
    ): String {
        val headers = js("{}")
        headers["Content-Type"] = "application/json"
        if (admin) headers["X-User-Role"] = "ADMIN"

        val init = js("{}")
        init.method = method
        init.headers = headers
        if (body != null) init.body = body

        val response = window.fetch("${backendUrl.trimEnd('/')}$path", init.unsafeCast<RequestInit>()).await()
        val text = response.text().await()
        if (!response.ok) error("HTTP ${response.status}: $text")
        return text
    }

    fun pretty(json: String): String =
        runCatching { JSON.stringify(JSON.parse<dynamic>(json), null, 2) }.getOrElse { json }

    fun jsonBody(vararg fields: Pair<String, Any?>): String =
        JSON.stringify(jsonObject(*fields))

    fun jsonObject(vararg fields: Pair<String, Any?>): dynamic {
        val obj = js("{}")
        fields.forEach { (key, value) -> obj[key] = value }
        return obj
    }

    fun pathSegment(value: String): String =
        js("encodeURIComponent")(value) as String
}
