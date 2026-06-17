plugins {
    kotlin("jvm")
    kotlin("plugin.serialization")
    application
}

application {
    mainClass.set("pl.edu.wat.uavlogistics.controller.ControllerMainKt")
}

dependencies {
    implementation(project(":common"))
    implementation("io.ktor:ktor-client-core-jvm:2.3.12")
    implementation("io.ktor:ktor-client-cio-jvm:2.3.12")
    implementation("io.ktor:ktor-client-content-negotiation-jvm:2.3.12")
    implementation("io.ktor:ktor-serialization-kotlinx-json-jvm:2.3.12")
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:1.9.0")
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-rx2:1.9.0")
    implementation("io.mavsdk:mavsdk:3.0.0")
    implementation("io.dronefleet.mavlink:mavlink:1.1.11")
    implementation("ch.qos.logback:logback-classic:1.5.12")

    testImplementation(kotlin("test-junit5"))
    testImplementation("org.jetbrains.kotlinx:kotlinx-coroutines-test:1.9.0")
}
