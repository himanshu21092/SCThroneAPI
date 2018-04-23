'use strict';
module.exports = function (app) {
    var queue = require('../controllers/queueController');

    // queue Routes
    app.route('/iamnext/:employeeId')
        .get(queue.add_in_queue)

    app.route('/createNewEmployee')
        .post(queue.add_new_employee)

    app.route('/done/:employeeId')
        .get(queue.done)


    // app.route('/check-who-inside/:taskId')
    //     .get(queue.check_who)
};