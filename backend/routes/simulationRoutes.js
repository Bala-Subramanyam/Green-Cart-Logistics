const express=require('express');
const route=express.Router();
const {runSimulation, getLatestSimulationResult}=require('../controllers/simulationControllers.js');
const authenticate=require('../middleware/jwt_authentication.js');

route.post('/run',authenticate,runSimulation);
route.get('/latest',authenticate,getLatestSimulationResult);

module.exports=route;