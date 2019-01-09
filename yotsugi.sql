--
-- PostgreSQL database dump
--

-- Dumped from database version 10.6 (Ubuntu 10.6-1.pgdg16.04+1)
-- Dumped by pg_dump version 10.1

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


SET search_path = public, pg_catalog;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: consumer; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE consumer (
    id integer NOT NULL,
    psid character varying(64) NOT NULL,
    nickname character varying(32)
);


--
-- Name: consumer_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE consumer_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: consumer_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE consumer_id_seq OWNED BY consumer.id;


--
-- Name: wanikani; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE wanikani (
    consumer character varying(64) NOT NULL,
    api_key character varying(128)
);


--
-- Name: consumer id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY consumer ALTER COLUMN id SET DEFAULT nextval('consumer_id_seq'::regclass);


--
-- Name: consumer consumer_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY consumer
    ADD CONSTRAINT consumer_pkey PRIMARY KEY (id);


--
-- Name: consumer consumer_psid_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY consumer
    ADD CONSTRAINT consumer_psid_key UNIQUE (psid);


--
-- Name: wanikani wanikani_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY wanikani
    ADD CONSTRAINT wanikani_pkey PRIMARY KEY (consumer);


--
-- PostgreSQL database dump complete
--

