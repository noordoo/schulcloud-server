const Ajv = require('ajv');
const service = require('feathers-mongoose');
const { authenticate } = require('@feathersjs/authentication');
const {
	iff, isProvider, validateSchema, disallow,
} = require('feathers-hooks-common');
const { datasourceModel } = require('../model');
const { updatedBy, createdBy, protectFields } = require('../hooks');

const { restrictToCurrentSchool, hasPermission, denyIfNotCurrentSchool } = require('../../../hooks');
const { datasourcesCreateSchema, datasourcesPatchSchema } = require('../schemas');

/**
 * the datasources service manages the datasources collection.
 */
const datasourceService = service({
	Model: datasourceModel,
	paginate: {
		default: 10,
		max: 50,
	},
});

const datasourceHooks = {
	before: {
		all: [
			authenticate('jwt'),
		],
		find: [
			iff(isProvider('external'), [
				restrictToCurrentSchool,
				hasPermission('DATASOURCES_VIEW'),
			]),
		],
		get: [iff(isProvider('external'), hasPermission('DATASOURCES_VIEW'))],
		create: [
			iff(isProvider('external'), [
				restrictToCurrentSchool,
				hasPermission('DATASOURCES_CREATE'),
				validateSchema(datasourcesCreateSchema, Ajv),
				createdBy,
			]),
		],
		update: [disallow()],
		patch: [
			iff(isProvider('external'), [
				restrictToCurrentSchool,
				hasPermission('DATASOURCES_EDIT'),
				validateSchema(datasourcesPatchSchema, Ajv),
				updatedBy,
			]),
		],
		remove: [
			iff(isProvider('external'), [
				restrictToCurrentSchool,
				hasPermission('DATASOURCES_DELETE'),
			]),
		],
	},
	after: {
		all: [],
		find: [iff(isProvider('external'), protectFields)],
		get: [
			iff(isProvider('external'), [
				denyIfNotCurrentSchool({
					errorMessage: 'You do not have valid permissions to access this.',
				}),
				protectFields,
			]),
		],
		create: [iff(isProvider('external'), protectFields)],
		update: [iff(isProvider('external'), protectFields)],
		patch: [iff(isProvider('external'), protectFields)],
		remove: [iff(isProvider('external'), protectFields)],
	},
};

module.exports = { datasourceService, datasourceHooks };
