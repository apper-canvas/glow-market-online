const reviewService = {
  // Helper function to transform database review to expected format
  transformReview(dbReview) {
    return {
      Id: dbReview.Id,
      productId: dbReview.product_id_c,
      rating: parseInt(dbReview.rating_c) || 0,
      title: dbReview.title_c,
      content: dbReview.content_c,
      reviewerName: dbReview.reviewer_name_c,
      date: dbReview.date_c,
      helpful: parseInt(dbReview.helpful_c) || 0
    };
  },

  async getAll() {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "product_id_c"}},
          {"field": {"Name": "rating_c"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "content_c"}},
          {"field": {"Name": "reviewer_name_c"}},
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "helpful_c"}}
        ]
      };

      const response = await apperClient.fetchRecords('review_c', params);
      
      if (!response.success) {
        console.error("Error fetching reviews:", response.message);
        return [];
      }

      return response.data.map(review => this.transformReview(review));
    } catch (error) {
      console.error("Error fetching reviews:", error);
      return [];
    }
  },

  async getById(id) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "product_id_c"}},
          {"field": {"Name": "rating_c"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "content_c"}},
          {"field": {"Name": "reviewer_name_c"}},
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "helpful_c"}}
        ]
      };

      const response = await apperClient.getRecordById('review_c', parseInt(id), params);
      
      if (!response.success || !response.data) {
        return null;
      }

      return this.transformReview(response.data);
    } catch (error) {
      console.error("Error fetching review by ID:", error);
      return null;
    }
  },

  async getByProductId(productId) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "product_id_c"}},
          {"field": {"Name": "rating_c"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "content_c"}},
          {"field": {"Name": "reviewer_name_c"}},
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "helpful_c"}}
        ],
        where: [{"FieldName": "product_id_c", "Operator": "EqualTo", "Values": [productId.toString()]}],
        orderBy: [{"fieldName": "date_c", "sorttype": "DESC"}]
      };

      const response = await apperClient.fetchRecords('review_c', params);
      
      if (!response.success) {
        console.error("Error fetching reviews by product ID:", response.message);
        return [];
      }

      return response.data.map(review => this.transformReview(review));
    } catch (error) {
      console.error("Error fetching reviews by product ID:", error);
      return [];
    }
  },

  async create(reviewData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        records: [{
          product_id_c: reviewData.productId.toString(),
          rating_c: parseInt(reviewData.rating),
          title_c: reviewData.title,
          content_c: reviewData.content,
          reviewer_name_c: reviewData.reviewerName,
          date_c: new Date().toISOString().split('T')[0],
          helpful_c: 0
        }]
      };

      const response = await apperClient.createRecord('review_c', params);
      
      if (!response.success) {
        console.error("Error creating review:", response.message);
        return null;
      }

      if (response.results && response.results[0] && response.results[0].success) {
        return this.transformReview(response.results[0].data);
      }

      return null;
    } catch (error) {
      console.error("Error creating review:", error);
      return null;
    }
  },

  async markHelpful(reviewId) {
    try {
      // First get the current review
      const currentReview = await this.getById(reviewId);
      if (!currentReview) return null;

      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        records: [{
          Id: parseInt(reviewId),
          helpful_c: currentReview.helpful + 1
        }]
      };

      const response = await apperClient.updateRecord('review_c', params);
      
      if (!response.success) {
        console.error("Error updating review helpful count:", response.message);
        return null;
      }

      if (response.results && response.results[0] && response.results[0].success) {
        return this.transformReview(response.results[0].data);
      }

      return null;
    } catch (error) {
      console.error("Error marking review helpful:", error);
      return null;
    }
  },

  async getAverageRating(productId) {
    try {
      const productReviews = await this.getByProductId(productId);
      if (productReviews.length === 0) return 0;
      
      const total = productReviews.reduce((sum, review) => sum + review.rating, 0);
      return Math.round((total / productReviews.length) * 10) / 10;
    } catch (error) {
      console.error("Error calculating average rating:", error);
      return 0;
    }
  },

  async getRatingDistribution(productId) {
    try {
      const productReviews = await this.getByProductId(productId);
      const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
      
      productReviews.forEach(review => {
        distribution[review.rating]++;
      });

      return distribution;
    } catch (error) {
      console.error("Error calculating rating distribution:", error);
      return { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    }
  }
};

export default reviewService;
