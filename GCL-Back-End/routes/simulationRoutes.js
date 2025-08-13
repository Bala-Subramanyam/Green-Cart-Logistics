const express=require('express');
const route=express.Router();
const {runSimulation, getLatestSimulationResult}=require('../controllers/simulationControllers.js')

route.post('/run',runSimulation);
route.get('/latest',getLatestSimulationResult);

module.exports=route;