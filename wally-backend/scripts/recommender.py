import pandas as pd
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.feature_extraction.text import TfidfVectorizer

# Sample data for demonstration purposes
products = [
    {"id": 1, "title": "Product A", "description": "This is a great product for your needs."},
    {"id": 2, "title": "Product B", "description": "An excellent choice for anyone looking for quality."},
    {"id": 3, "title": "Product C", "description": "A fantastic product that meets all your requirements."},
]

# Function to generate recommendations based on product descriptions
def generate_recommendations(product_id, num_recommendations=2):
    # Create a DataFrame from the products
    df = pd.DataFrame(products)
    
    # Vectorize the product descriptions
    tfidf = TfidfVectorizer()
    tfidf_matrix = tfidf.fit_transform(df['description'])
    
    # Calculate cosine similarity
    cosine_sim = cosine_similarity(tfidf_matrix, tfidf_matrix)
    
    # Get the index of the product that matches the product_id
    idx = df.index[df['id'] == product_id].tolist()[0]
    
    # Get the pairwise similarity scores of all products with that product
    sim_scores = list(enumerate(cosine_sim[idx]))
    
    # Sort the products based on the similarity scores
    sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)
    
    # Get the scores of the most similar products
    sim_scores = sim_scores[1:num_recommendations + 1]
    
    # Get the product indices
    product_indices = [i[0] for i in sim_scores]
    
    # Return the top recommended products
    return df.iloc[product_indices]

# Example usage
if __name__ == "__main__":
    recommendations = generate_recommendations(product_id=1)
    print("Recommended Products:")
    print(recommendations[['id', 'title']])