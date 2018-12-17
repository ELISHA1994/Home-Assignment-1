/**
 *  Create and export configuration variables
 *  
 */

// Container for all the environments
var environments = {};

// The default environment
environments.defaultENV = {
    'httpPort' : 3030,
    'httpsPort' : 3131,
    'envName' : 'defaultENV'
};

// Production enviroment
environments.productionENV = {
    'httpPort' : 4040,
    'httpsPort' : 4141,
    'envName' : 'productionENV'
};

// Determine which environment was passed as command-line argument
var passedEnvironments = typeof(process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV.toLowerCase() : '';

// Check enivironment to see if the enivironment passed is one of the environment defined : default to defaultENV
var environmentToExport = typeof(environments[passedEnvironments]) == 'object' ? environments[passedEnvironments] : environments.defaultENV;

// Export modules
module.exports = environmentToExport;