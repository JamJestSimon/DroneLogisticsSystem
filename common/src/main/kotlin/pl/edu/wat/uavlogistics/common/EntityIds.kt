package pl.edu.wat.uavlogistics.common

import java.util.UUID

fun parseEntityId(raw: String): UUID = UUID.fromString(raw)

fun parseEntityIdOrNull(raw: String?): UUID? = raw?.let { UUID.fromString(it) }
