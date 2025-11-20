import React from 'react';

const App = () => {
    return (
        <div className="container">
            <div className="row justify-content-center">
                <div className="col-md-8">
                    <div className="card">
                        <div className="card-header">React App</div>
                        <div className="card-body">
                            <h1>Welcome to the Ruaa Project</h1>
                            <p>Your React frontend is running on port 3000!</p>
                            <p>This app is connected to the Laravel backend running on port 8000.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default App;