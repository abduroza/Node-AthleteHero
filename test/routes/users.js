let mongoose = require("mongoose");
let Users = require("../../models/api/v1/users");

var app = require('../../app');
const faker = require('faker');
var chai = require('chai');
var chaiHttp = require('chai-http');
var expect = chai.expect;
var should = chai.should;

chai.use(chaiHttp);
