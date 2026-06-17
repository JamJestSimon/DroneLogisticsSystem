package pl.edu.wat.uavlogistics.backend.persistence

import org.flywaydb.core.Flyway
import org.jetbrains.exposed.sql.Database

data class DatabaseConfig(
    val url: String,
    val driver: String,
    val user: String,
    val password: String,
) {
    companion object {
        fun fromEnv(): DatabaseConfig = DatabaseConfig(
            url = System.getenv("DB_URL") ?: "jdbc:postgresql://localhost:5432/uav_logistics",
            driver = System.getenv("DB_DRIVER") ?: "org.postgresql.Driver",
            user = System.getenv("DB_USER") ?: "uav",
            password = System.getenv("DB_PASSWORD") ?: "uav",
        )
    }
}

object DatabaseFactory {
    fun init(config: DatabaseConfig = DatabaseConfig.fromEnv()): Database {
        Flyway.configure()
            .dataSource(config.url, config.user, config.password)
            .locations("classpath:db/migration")
            .load()
            .migrate()

        return Database.connect(
            url = config.url,
            driver = config.driver,
            user = config.user,
            password = config.password,
        )
    }
}
