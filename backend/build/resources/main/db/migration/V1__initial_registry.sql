CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    role VARCHAR(32) NOT NULL
);

CREATE TABLE IF NOT EXISTS transfer_stations (
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    lat DOUBLE PRECISION NOT NULL,
    lon DOUBLE PRECISION NOT NULL,
    alt DOUBLE PRECISION NOT NULL,
    storage_capacity INTEGER NOT NULL,
    occupied_storage INTEGER NOT NULL,
    parking_capacity INTEGER NOT NULL,
    occupied_parking INTEGER NOT NULL,
    status VARCHAR(32) NOT NULL
);

CREATE TABLE IF NOT EXISTS transport_agents (
    id UUID PRIMARY KEY,
    type VARCHAR(16) NOT NULL,
    lat DOUBLE PRECISION NOT NULL,
    lon DOUBLE PRECISION NOT NULL,
    alt DOUBLE PRECISION NOT NULL,
    energy_level_percent DOUBLE PRECISION NOT NULL,
    max_range_meters DOUBLE PRECISION NOT NULL,
    payload_capacity_kg DOUBLE PRECISION NOT NULL,
    status VARCHAR(32) NOT NULL,
    current_station_id UUID
);

CREATE TABLE IF NOT EXISTS shipments (
    id UUID PRIMARY KEY,
    customer_id UUID NOT NULL,
    sender_name VARCHAR(255) NOT NULL,
    recipient_name VARCHAR(255) NOT NULL,
    origin_lat DOUBLE PRECISION NOT NULL,
    origin_lon DOUBLE PRECISION NOT NULL,
    origin_alt DOUBLE PRECISION NOT NULL,
    destination_lat DOUBLE PRECISION NOT NULL,
    destination_lon DOUBLE PRECISION NOT NULL,
    destination_alt DOUBLE PRECISION NOT NULL,
    weight_kg DOUBLE PRECISION NOT NULL,
    volume_m3 DOUBLE PRECISION NOT NULL,
    requires_ground_transport BOOLEAN NOT NULL,
    status VARCHAR(32) NOT NULL,
    current_station_id UUID,
    carrying_agent_id UUID
);

CREATE TABLE IF NOT EXISTS transport_tasks (
    id UUID PRIMARY KEY,
    shipment_id UUID NOT NULL REFERENCES shipments(id),
    start_lat DOUBLE PRECISION NOT NULL,
    start_lon DOUBLE PRECISION NOT NULL,
    start_alt DOUBLE PRECISION NOT NULL,
    end_lat DOUBLE PRECISION NOT NULL,
    end_lon DOUBLE PRECISION NOT NULL,
    end_alt DOUBLE PRECISION NOT NULL,
    start_station_id UUID,
    end_station_id UUID,
    kind VARCHAR(32) NOT NULL DEFAULT 'PACKAGE',
    status VARCHAR(32) NOT NULL,
    assigned_agent_id UUID
);

CREATE TABLE IF NOT EXISTS shipment_events (
    id UUID PRIMARY KEY,
    shipment_id UUID NOT NULL REFERENCES shipments(id),
    task_id UUID,
    agent_id UUID,
    station_id UUID,
    type VARCHAR(64) NOT NULL,
    occurred_at TIMESTAMP NOT NULL,
    description VARCHAR(1024) NOT NULL
);

CREATE TABLE IF NOT EXISTS parking_slot_reservations (
    agent_id UUID PRIMARY KEY,
    station_id UUID NOT NULL REFERENCES transfer_stations(id),
    slot_index INTEGER NOT NULL,
    ephemeral BOOLEAN NOT NULL DEFAULT FALSE,
    expects_vacate_by UUID
);

CREATE INDEX IF NOT EXISTS idx_transport_tasks_status ON transport_tasks(status);
CREATE INDEX IF NOT EXISTS idx_transport_tasks_assigned_agent ON transport_tasks(assigned_agent_id);
CREATE INDEX IF NOT EXISTS idx_shipment_events_shipment ON shipment_events(shipment_id);
CREATE INDEX IF NOT EXISTS idx_shipment_events_shipment_occurred ON shipment_events(shipment_id, occurred_at);
CREATE UNIQUE INDEX IF NOT EXISTS uq_parking_slot_station_slot_index
    ON parking_slot_reservations (station_id, slot_index);
