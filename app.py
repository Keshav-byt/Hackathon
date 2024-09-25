from flask import Flask, render_template, request, jsonify
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import StandardScaler

app = Flask(__name__)

# Load and prepare data
def load_data():
    # Simulated data; replace with real data as needed
    return pd.DataFrame({
        'population_density': np.random.randint(100, 10000, 1000),
        'traffic_flow': np.random.randint(1000, 100000, 1000),
        'existing_stations': np.random.randint(0, 20, 1000),
        'ev_density': np.random.randint(10, 1000, 1000),
        'optimal_location_score': np.random.randint(0, 100, 1000)
    })

# Train a RandomForest model
def train_model(X, y):
    # Split the dataset into training and test sets
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    # Feature scaling
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)
    
    # Initialize the RandomForestRegressor model
    model = RandomForestRegressor(n_estimators=100, random_state=42)
    
    # Train the model
    model.fit(X_train_scaled, y_train)
    
    # Return the trained model and the scaler
    return model, scaler

# Load data and train model
data = load_data()
X = data[['population_density', 'traffic_flow', 'existing_stations', 'ev_density']]
y = data['optimal_location_score']
model, scaler = train_model(X, y)

@app.route('/')
def home():
    # Render the index.html page
    return render_template('index.html')

@app.route('/predict', methods=['POST'])
def predict():
    # Extracting features from the form
    features = [
        float(request.form['population_density']),
        float(request.form['traffic_flow']),
        float(request.form['existing_stations']),
        float(request.form['ev_density'])
    ]
    
    # Scaling the features
    features_scaled = scaler.transform(np.array(features).reshape(1, -1))
    
    # Make the prediction using the trained model
    prediction = model.predict(features_scaled)[0]
    
    # Return the prediction result as JSON
    return jsonify({'prediction': round(prediction, 2)})

if __name__ == '__main__':
    app.run(debug=True)
