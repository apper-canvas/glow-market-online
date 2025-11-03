const productService = {
  // Helper function to transform database product to expected format
  transformProduct(dbProduct) {
    return {
      Id: dbProduct.Id,
      name: dbProduct.name_c,
      brand: dbProduct.brand_c,
      category: dbProduct.category_c,
      subcategory: dbProduct.subcategory_c,
      price: parseFloat(dbProduct.price_c) || 0,
      salePrice: dbProduct.sale_price_c ? parseFloat(dbProduct.sale_price_c) : null,
      images: dbProduct.images_c ? JSON.parse(dbProduct.images_c) : [],
      description: dbProduct.description_c,
      ingredients: dbProduct.ingredients_c ? JSON.parse(dbProduct.ingredients_c) : [],
      rating: parseFloat(dbProduct.rating_c) || 0,
      reviewCount: parseInt(dbProduct.review_count_c) || 0,
      inStock: dbProduct.in_stock_c,
      tags: dbProduct.tags_c ? JSON.parse(dbProduct.tags_c) : []
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
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "brand_c"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "subcategory_c"}},
          {"field": {"Name": "price_c"}},
          {"field": {"Name": "sale_price_c"}},
          {"field": {"Name": "images_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "ingredients_c"}},
          {"field": {"Name": "rating_c"}},
          {"field": {"Name": "review_count_c"}},
          {"field": {"Name": "in_stock_c"}},
          {"field": {"Name": "tags_c"}}
        ]
      };

      const response = await apperClient.fetchRecords('product_c', params);
      
      if (!response.success) {
        console.error("Error fetching products:", response.message);
        return [];
      }

      return response.data.map(product => this.transformProduct(product));
    } catch (error) {
      console.error("Error fetching products:", error);
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
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "brand_c"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "subcategory_c"}},
          {"field": {"Name": "price_c"}},
          {"field": {"Name": "sale_price_c"}},
          {"field": {"Name": "images_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "ingredients_c"}},
          {"field": {"Name": "rating_c"}},
          {"field": {"Name": "review_count_c"}},
          {"field": {"Name": "in_stock_c"}},
          {"field": {"Name": "tags_c"}}
        ]
      };

      const response = await apperClient.getRecordById('product_c', parseInt(id), params);
      
      if (!response.success || !response.data) {
        return null;
      }

      return this.transformProduct(response.data);
    } catch (error) {
      console.error("Error fetching product by ID:", error);
      return null;
    }
  },

  async getByCategory(category) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "brand_c"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "subcategory_c"}},
          {"field": {"Name": "price_c"}},
          {"field": {"Name": "sale_price_c"}},
          {"field": {"Name": "images_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "ingredients_c"}},
          {"field": {"Name": "rating_c"}},
          {"field": {"Name": "review_count_c"}},
          {"field": {"Name": "in_stock_c"}},
          {"field": {"Name": "tags_c"}}
        ],
        where: [{"FieldName": "category_c", "Operator": "EqualTo", "Values": [category]}]
      };

      const response = await apperClient.fetchRecords('product_c', params);
      
      if (!response.success) {
        console.error("Error fetching products by category:", response.message);
        return [];
      }

      return response.data.map(product => this.transformProduct(product));
    } catch (error) {
      console.error("Error fetching products by category:", error);
      return [];
    }
  },

  async getBySubcategory(subcategory) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "brand_c"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "subcategory_c"}},
          {"field": {"Name": "price_c"}},
          {"field": {"Name": "sale_price_c"}},
          {"field": {"Name": "images_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "ingredients_c"}},
          {"field": {"Name": "rating_c"}},
          {"field": {"Name": "review_count_c"}},
          {"field": {"Name": "in_stock_c"}},
          {"field": {"Name": "tags_c"}}
        ],
        where: [{"FieldName": "subcategory_c", "Operator": "EqualTo", "Values": [subcategory]}]
      };

      const response = await apperClient.fetchRecords('product_c', params);
      
      if (!response.success) {
        console.error("Error fetching products by subcategory:", response.message);
        return [];
      }

      return response.data.map(product => this.transformProduct(product));
    } catch (error) {
      console.error("Error fetching products by subcategory:", error);
      return [];
    }
  },

  async search(query) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const searchTerm = query.toLowerCase();

      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "brand_c"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "subcategory_c"}},
          {"field": {"Name": "price_c"}},
          {"field": {"Name": "sale_price_c"}},
          {"field": {"Name": "images_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "ingredients_c"}},
          {"field": {"Name": "rating_c"}},
          {"field": {"Name": "review_count_c"}},
          {"field": {"Name": "in_stock_c"}},
          {"field": {"Name": "tags_c"}}
        ],
        whereGroups: [{
          "operator": "OR",
          "subGroups": [
            {
              "conditions": [
                {"fieldName": "name_c", "operator": "Contains", "values": [searchTerm]}
              ]
            },
            {
              "conditions": [
                {"fieldName": "brand_c", "operator": "Contains", "values": [searchTerm]}
              ]
            },
            {
              "conditions": [
                {"fieldName": "description_c", "operator": "Contains", "values": [searchTerm]}
              ]
            }
          ]
        }]
      };

      const response = await apperClient.fetchRecords('product_c', params);
      
      if (!response.success) {
        console.error("Error searching products:", response.message);
        return [];
      }

      return response.data.map(product => this.transformProduct(product));
    } catch (error) {
      console.error("Error searching products:", error);
      return [];
    }
  },

  async getFeatured(limit = 8) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "brand_c"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "subcategory_c"}},
          {"field": {"Name": "price_c"}},
          {"field": {"Name": "sale_price_c"}},
          {"field": {"Name": "images_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "ingredients_c"}},
          {"field": {"Name": "rating_c"}},
          {"field": {"Name": "review_count_c"}},
          {"field": {"Name": "in_stock_c"}},
          {"field": {"Name": "tags_c"}}
        ],
        orderBy: [{"fieldName": "rating_c", "sorttype": "DESC"}],
        pagingInfo: {"limit": limit, "offset": 0}
      };

      const response = await apperClient.fetchRecords('product_c', params);
      
      if (!response.success) {
        console.error("Error fetching featured products:", response.message);
        return [];
      }

      return response.data.map(product => this.transformProduct(product));
    } catch (error) {
      console.error("Error fetching featured products:", error);
      return [];
    }
  },

  async getRelated(productId, limit = 4) {
    try {
      // First get the product to find its category
      const product = await this.getById(productId);
      if (!product) return [];

      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "brand_c"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "subcategory_c"}},
          {"field": {"Name": "price_c"}},
          {"field": {"Name": "sale_price_c"}},
          {"field": {"Name": "images_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "ingredients_c"}},
          {"field": {"Name": "rating_c"}},
          {"field": {"Name": "review_count_c"}},
          {"field": {"Name": "in_stock_c"}},
          {"field": {"Name": "tags_c"}}
        ],
        where: [
          {"FieldName": "category_c", "Operator": "EqualTo", "Values": [product.category]},
          {"FieldName": "Id", "Operator": "NotEqualTo", "Values": [parseInt(productId)]}
        ],
        pagingInfo: {"limit": limit, "offset": 0}
      };

      const response = await apperClient.fetchRecords('product_c', params);
      
      if (!response.success) {
        console.error("Error fetching related products:", response.message);
        return [];
      }

      return response.data.map(product => this.transformProduct(product));
    } catch (error) {
      console.error("Error fetching related products:", error);
      return [];
    }
  },

  async filterProducts(filters = {}) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      let where = [];
      let orderBy = [];

      // Build where conditions
      if (filters.category) {
        where.push({"FieldName": "category_c", "Operator": "EqualTo", "Values": [filters.category]});
      }

      if (filters.subcategory) {
        where.push({"FieldName": "subcategory_c", "Operator": "EqualTo", "Values": [filters.subcategory]});
      }

      if (filters.brand && filters.brand.length > 0) {
        where.push({"FieldName": "brand_c", "Operator": "ExactMatch", "Values": filters.brand});
      }

      if (filters.priceMin !== undefined && filters.priceMin !== "") {
        where.push({"FieldName": "price_c", "Operator": "GreaterThanOrEqualTo", "Values": [parseFloat(filters.priceMin)]});
      }

      if (filters.priceMax !== undefined && filters.priceMax !== "") {
        where.push({"FieldName": "price_c", "Operator": "LessThanOrEqualTo", "Values": [parseFloat(filters.priceMax)]});
      }

      if (filters.inStock) {
        where.push({"FieldName": "in_stock_c", "Operator": "EqualTo", "Values": [true]});
      }

      // Build sort order
      if (filters.sortBy) {
        switch (filters.sortBy) {
          case "price-low":
            orderBy.push({"fieldName": "price_c", "sorttype": "ASC"});
            break;
          case "price-high":
            orderBy.push({"fieldName": "price_c", "sorttype": "DESC"});
            break;
          case "rating":
            orderBy.push({"fieldName": "rating_c", "sorttype": "DESC"});
            break;
          case "newest":
            orderBy.push({"fieldName": "Id", "sorttype": "DESC"});
            break;
          default:
            orderBy.push({"fieldName": "rating_c", "sorttype": "DESC"});
        }
      } else {
        orderBy.push({"fieldName": "rating_c", "sorttype": "DESC"});
      }

      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "brand_c"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "subcategory_c"}},
          {"field": {"Name": "price_c"}},
          {"field": {"Name": "sale_price_c"}},
          {"field": {"Name": "images_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "ingredients_c"}},
          {"field": {"Name": "rating_c"}},
          {"field": {"Name": "review_count_c"}},
          {"field": {"Name": "in_stock_c"}},
          {"field": {"Name": "tags_c"}}
        ],
        where: where,
        orderBy: orderBy
      };

      const response = await apperClient.fetchRecords('product_c', params);
      
      if (!response.success) {
        console.error("Error filtering products:", response.message);
        return [];
      }

      let results = response.data.map(product => this.transformProduct(product));

      // Client-side tag filtering (since tags are stored as JSON arrays)
      if (filters.tags && filters.tags.length > 0) {
        results = results.filter(p => 
          filters.tags.some(tag => p.tags.includes(tag))
        );
      }

      return results;
    } catch (error) {
      console.error("Error filtering products:", error);
      return [];
    }
  }
};
export default productService;