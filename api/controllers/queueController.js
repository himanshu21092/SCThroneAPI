'use strict';
const mongoose = require('mongoose')
const Employee = mongoose.model('Employee');
const Queue = mongoose.model('Queue');


let updateCurrentUser = (empID, callback) => {
    console.log("User to update", empID);
    Employee.findByIdAndUpdate(empID, { currentUser: true }, (err, user) => {
        if (err) res.json(err);

        console.log("User", user);
        callback();
    });
}

exports.add_in_queue = function (req, res) {
    let id = req.params.employeeId;

    if (id == 'undefined') {
        res.status(500).json({status : 500, message : "Something went wrong."});
        return;
    }

    Employee.findOne({ currentUser: true }, (err, employee) => {
        if (err) res.json(err);


        // If currentuser exists
        if (employee) {
            // If currentuser exists and it is the requesting user
            if (employee._id == id) {
                res.json({
                    message: "You are already using it."
                })
            }
            // If currentuser exists and it is some other user
            else {
                Queue.findOne({}, (err, result) => {
                    if (err) res.json(err);

                    // If queue exists
                    if (result) {

                        if (result.queue.length == 0) {
                            result.queue.push(id);
                        }
                        else {
                            let status = 0;

                            result.queue.forEach(element => {
                                if (id == element) {
                                    status = 1;
                                }
                            });

                            // If user exists in queue
                            if (status) {
                                res.json({
                                    message: "You are already in queue."
                                })
                                return;
                            }
                            // If user does not exist in queue
                            else {
                                result.queue.push(id);
                            }
                        }


                    }
                    // If queue does not exist
                    else {
                        result = new Queue({
                            queue: [id]
                        });
                    }

                    result.save(function (err, updatedResult) {
                        if (err) return res.json(err);

                        res.json({
                            message: "You are added to queue."
                        })
                        console.log("New Queue", updatedResult);
                    });
                });
            }
        }
        else {
            updateCurrentUser(id, () => {
                res.json({
                    message: "You can go in."
                })
            });
        }
    });
};

exports.done = function (req, res) {
    let id = req.params.employeeId;

    Employee.findById(id, (err, user) => {
        if (err) res.json(err);

        if (user) {
            if (user.id === id && user.currentUser == true) {
                user.currentUser = false;

                user.save(function (err, updatedUser) {
                    if (err) return res.json(err);

                    Queue.findOne({}, (err, result) => {
                        if (err) res.json(err);

                        if (result && result.queue.length != 0) {
                            let empId = result.queue.shift();
                            console.log(empId);

                            result.save(function (err, updatedResult) {
                                if (err) return res.json(err);

                                console.log(updatedResult);
                                updateCurrentUser(empId, () => {
                                    res.json({
                                        message: "Success"
                                    })
                                });
                            });


                        }
                        else {
                            res.json({
                                message: "Success"
                            })
                        }
                    });
                });
            }
            else {
                res.status(409).json({
                    message: "Unable to do the action. Refresh page."
                })
            }
        }
        else {
            res.status(404).json({
                message: "No User found."
            })
        }

    });
};

exports.add_new_employee = function (req, res) {
    let name = req.body.displayName;
    let googleUserID = req.body.userId;
    let picture = req.body.imageUrl || "";

    Employee.findOne({ 'googleUserID': googleUserID }, function (err, employee) {
        if (err) res.json(err);
        if (employee) {
            res.status(409).send({
                error: "Employee already exists.",
                employee: employee
            })
        }
        else {
            var new_employee = new Employee({
                name,
                googleUserID,
                picture
            });

            console.log(new_employee);

            new_employee.save(function (err, employee) {
                if (err)
                    res.json(err);
                res.json(employee);
            });
        }
    });
};

exports.get_current_state = function (req, res) {
    let data = {
        queue: [],
        currentUser: {}
    }

    Employee.findOne({ 'currentUser': true }, (err, employee) => {
        if (err) res.json(err);

        if (employee) {
            data.currentUser = employee;
        }
        else {
            data.currentUser = null;
        }

        Queue.findOne({}, (err, result) => {
            if (err) res.json(err);

            if (result) {
                if (result.queue.length == 0) {
                    data.queue = [];
                    res.json(data);
                }
                else {
                    let status = 0;
                    result.queue.forEach(id => {
                        Employee.findOne({ id: id }, (err, employee) => {
                            if (err) res.json(err);

                            if (employee) {
                                status++;
                                data.queue.push(employee);

                                if (status == result.queue.length) {
                                    res.json(data);
                                }
                            }
                        });
                    });
                }
            }
            else {
                data.queue = [];
                res.json(data);
            }

        });

    });

}