package pl.edu.wat.uavlogistics.backend.service

open class ServiceException(message: String) : RuntimeException(message)

class NotFoundException(message: String) : ServiceException(message)

class ConflictException(message: String) : ServiceException(message)

class ValidationException(message: String) : ServiceException(message)
