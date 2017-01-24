const express = require('express');
const router = express.Router();

const cfg = require('../cfg');
const _ = require('underscore');
const bunyan = require('bunyan');
const log = bunyan.createLogger(_.extend(cfg.logging, {name: 'user'}));

const models = require('../models');

/**
 * get all resources /resources
 */
router.get('/', function(req, res, next) {

	log.debug('HTTP GET all resources');

	models.Resource.findAll()
  .then((resources) =>{
    return res.status(200).json(resources);
  })
  .catch((err) => {
    log.error('encountered database error when loading resources %j', err);
		return res.status(500).json({
			resource : 'database error when loading resources'
		});
  });
});

/**
 * create new resource
 */
router.post('/', function(req, res, next) {
	log.debug('HTTP POST resource= %j', req.body);

  models.Resource.create(req.body)
	.then((resource) => {
		return res.status(200).json(resource);
	})
  .catch((err) => {
		log.error('encountered database error when save resource %j in POST', err);
		return res.status(500).json({
			message : 'database error when saving new resource:' + req.body.name
		});
	});
});

/**
 * load resource by id
 * @return message if load failed
 *  {'data': resource.id} if load success
 */
router.get('/:id', function(req, res, next) {
	var id = req.params.id;
	log.debug('HTTP GET /resources/%s', id);

	var query = Resource.findById(id);

  models.Resource.findById(id)
  .then((resource) =>{
    if (!resource) {
      return res.status(500).json({
  			message : 'resource id=(' + id + ') does not existing'
  		});
      //return res.status(200).json({'data':null});
    }
    return res.status(200).json({'data':resource});
  })
  .catch((err) => {
    log.error('encountered database error when load resource by id, %j', err);
		return res.status(500).json({
			message : 'database error when load resource by id=:' + id
		});
  });
});

/**
 * delete resource by id,
 * @return message if delete failed
 *  {'data': resource.id} if delete success
 */
router.delete('/:id', function(req, res, next){
	var id = req.params.id;
  log.debug('HTTP DELETE /resources/%s', id);

  models.Resource.findById(id)
  .then((resource) =>{
    if (!resource) {
      return res.status(200).json({'data':id});
    } else {
      return resource.destroy();
    }
  })
  .then(()=> {
    log.debug('resources id=%s has been deleted', id);
    return res.status(200).json({'data':id});
  })
  .catch((err) => {
    log.error('encountered database error when delete resource by id, %j', err);
    return res.status(500).json({
      message : 'database error when delete resource by id=:' + id
    });
  });
});

/**
 * update resource by id
 * @return updated resource as {'data': resource.id}
 */
router.put('/:id', function(req, res, next) {
	var id = req.params.id;
	var body = req.body;
  log.debug('HTTP PUT /resources/%s', id);

	delete body._id;

  models.Resource.findById(id)
  .then((resource) =>{
    // return error message if resource does not exsiting
    if (!resource) {
      return res.status(500).json({
        message : 'resource id=(' + id + ') does not existing'
      });
    } else {
      //only copies own properties over to the destination object
      _.assign(resource, body);
      return resource.save();
    }
  })
  .then((resource) => {
    log.debug('resources id=%s has been updated', id);
    return res.status(200).json({'data': resource});
  })
  .catch((err) => {
    log.error('encountered database error when update resource by id, %j', err);
    return res.status(500).json({
      message : 'database error when update resource by id=:' + id
    });
  });
});

module.exports = router;
