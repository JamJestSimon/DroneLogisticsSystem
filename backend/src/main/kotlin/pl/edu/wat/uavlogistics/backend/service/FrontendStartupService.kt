package pl.edu.wat.uavlogistics.backend.service

import java.io.File
import java.lang.ProcessBuilder.Redirect
import java.net.Socket
import java.nio.file.Path
import kotlin.io.path.absolutePathString

class FrontendStartupService(
    private val enabled: Boolean,
    private val projectRoot: Path,
    private val devServerHost: String,
    private val devServerPort: Int,
) {
    fun startFrontend(): Boolean {
        if (!enabled) return false
        if (isDevServerRunning()) {
            println("Frontend dev server already appears to be running at $devServerHost:$devServerPort.")
            return false
        }

        return runCatching {
            val logFile = projectRoot.resolve("build/runtime/frontend-start.log").toFile()
            logFile.parentFile.mkdirs()
            ProcessBuilder(
                "powershell.exe",
                "-NoProfile",
                "-ExecutionPolicy",
                "Bypass",
                "-File",
                projectRoot.resolve("runtime/local/start-frontend.ps1").absolutePathString(),
                "-ProjectRoot",
                projectRoot.absolutePathString(),
            )
                .directory(projectRoot.toFile())
                .redirectOutput(Redirect.appendTo(logFile))
                .redirectError(Redirect.appendTo(logFile))
                .start()
            true
        }.onFailure {
            println("Frontend startup command failed: ${it.message}")
        }.getOrDefault(false)
    }

    private fun isDevServerRunning(): Boolean = runCatching {
        Socket(devServerHost, devServerPort).use { true }
    }.getOrDefault(false)

    companion object {
        fun fromEnv(): FrontendStartupService {
            val projectRoot = Path.of(System.getenv("PROJECT_ROOT") ?: File(".").canonicalPath)
            return FrontendStartupService(
                enabled = (System.getenv("FRONTEND_START_ON_BACKEND") ?: "true").toBoolean(),
                projectRoot = projectRoot,
                devServerHost = System.getenv("FRONTEND_DEV_SERVER_HOST") ?: "127.0.0.1",
                devServerPort = (System.getenv("FRONTEND_DEV_SERVER_PORT") ?: "8081").toInt(),
            )
        }
    }
}
