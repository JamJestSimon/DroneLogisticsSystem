import org.gradle.api.tasks.testing.Test

plugins {
    kotlin("jvm") version "2.0.21" apply false
    kotlin("multiplatform") version "2.0.21" apply false
    kotlin("plugin.serialization") version "2.0.21" apply false
    kotlin("plugin.compose") version "2.0.21" apply false
    id("org.jetbrains.compose") version "1.7.1" apply false
    id("io.ktor.plugin") version "2.3.12" apply false
}

allprojects {
    group = "pl.edu.wat.uavlogistics"
    version = "0.1.0"
}

subprojects {
    tasks.withType<Test>().configureEach {
        useJUnitPlatform()
    }
}
