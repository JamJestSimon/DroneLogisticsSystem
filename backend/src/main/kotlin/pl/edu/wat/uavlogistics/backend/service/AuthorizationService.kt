package pl.edu.wat.uavlogistics.backend.service

import io.ktor.server.application.ApplicationCall
import io.ktor.server.request.header

class AuthorizationService {
    fun roleFrom(call: ApplicationCall): String? =
        call.request.header("X-User-Role")?.trim()?.uppercase()

    fun requireAdmin(call: ApplicationCall) {
        if (roleFrom(call) != "ADMIN") {
            throw ValidationException("Admin role is required. Send X-User-Role: ADMIN for administrative operations.")
        }
    }
}
