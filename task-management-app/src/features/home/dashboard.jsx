import React, {useEffect} from 'react';
import {fetchTaskCount} from "../tasks/taskActions.js";
import {useDispatch, useSelector} from "react-redux";

const Dashboard = () => {
    const dispatch = useDispatch();
    const { taskCount, loadingCount, errorCount } = useSelector(state => state.tasks);

    useEffect(() => {
        dispatch(fetchTaskCount());
    }, [dispatch]);

    return (
        <div className="container mt-4">
            <div className="row">
                <div className="col-md-3"> {/* Adjusted column size for better spacing */}
                    <div className="card shadow"> {/* Added shadow for visual appeal */}
                        <div className="card-body text-center"> {/* Centered content */}
                            <h5 className="card-title">Total Tasks</h5>
                            {loadingCount ? (
                                <p className="card-text" data-testid="loading-message-1">Loading...</p>
                            ) : errorCount ? (
                                <p className="card-text" data-testid="error-message-1">Error: {errorCount}</p>
                            ) : (
                                <p className="card-text display-4">{taskCount.totalTasks}</p>
                            )}
                        </div>
                    </div>
                </div>
                <div className="col-md-3"> {/* Adjusted column size for better spacing */}
                    <div className="card shadow"> {/* Added shadow for visual appeal */}
                        <div className="card-body text-center"> {/* Centered content */}
                            <h5 className="card-title">Completed Tasks</h5>
                            {loadingCount ? (
                                <p className="card-text" data-testid="loading-message-2">Loading...</p>
                            ) : errorCount ? (
                                <p className="card-text" data-testid="error-message-2">Error: {errorCount}</p>
                            ) : (
                                <p className="card-text display-4">{taskCount.totalCompletedTasks}</p>
                            )}
                        </div>
                    </div>
                </div>
                <div className="col-md-3"> {/* Adjusted column size for better spacing */}
                    <div className="card shadow"> {/* Added shadow for visual appeal */}
                        <div className="card-body text-center"> {/* Centered content */}
                            <h5 className="card-title">Pending Tasks</h5>
                            {loadingCount ? (
                                <p className="card-text" data-testid="loading-message-3">Loading...</p>
                            ) : errorCount ? (
                                <p className="card-text" data-testid="error-message-3">Error: {errorCount}</p>
                            ) : (
                                <p className="card-text display-4">{taskCount.totalPendingTasks}</p>
                            )}
                        </div>
                    </div>
                </div>
                <div className="col-md-3"> {/* Adjusted column size for better spacing */}
                    <div className="card shadow"> {/* Added shadow for visual appeal */}
                        <div className="card-body text-center"> {/* Centered content */}
                            <h5 className="card-title">Tasks In Progress</h5>
                            {loadingCount ? (
                                <p className="card-text">Loading...</p>
                            ) : errorCount ? (
                                <p className="card-text">Error: {errorCount}</p>
                            ) : (
                                <p className="card-text display-4">{taskCount.totalInProgressTasks}</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;