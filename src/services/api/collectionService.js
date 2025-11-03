import productService from "./productService.js";

const collectionService = {
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
          {"field": {"Name": "slug_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "image_c"}},
          {"field": {"Name": "featured_c"}},
          {"field": {"Name": "product_ids_c"}}
        ]
      };

      const response = await apperClient.fetchRecords('collection_c', params);
      
      if (!response.success) {
        console.error("Error fetching collections:", response.message);
        return [];
      }

      return response.data.map(collection => ({
        Id: collection.Id,
        name: collection.name_c,
        slug: collection.slug_c,
        description: collection.description_c,
        image: collection.image_c,
        featured: collection.featured_c,
        productIds: collection.product_ids_c ? JSON.parse(collection.product_ids_c) : []
      }));
    } catch (error) {
      console.error("Error fetching collections:", error);
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
          {"field": {"Name": "slug_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "image_c"}},
          {"field": {"Name": "featured_c"}},
          {"field": {"Name": "product_ids_c"}}
        ]
      };

      const response = await apperClient.getRecordById('collection_c', parseInt(id), params);
      
      if (!response.success || !response.data) {
        return null;
      }

      const collection = response.data;
      return {
        Id: collection.Id,
        name: collection.name_c,
        slug: collection.slug_c,
        description: collection.description_c,
        image: collection.image_c,
        featured: collection.featured_c,
        productIds: collection.product_ids_c ? JSON.parse(collection.product_ids_c) : []
      };
    } catch (error) {
      console.error("Error fetching collection by ID:", error);
      return null;
    }
  },

  async getBySlug(slug) {
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
          {"field": {"Name": "slug_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "image_c"}},
          {"field": {"Name": "featured_c"}},
          {"field": {"Name": "product_ids_c"}}
        ],
        where: [{"FieldName": "slug_c", "Operator": "EqualTo", "Values": [slug]}]
      };

      const response = await apperClient.fetchRecords('collection_c', params);
      
      if (!response.success || !response.data || response.data.length === 0) {
        return null;
      }

      const collection = response.data[0];
      return {
        Id: collection.Id,
        name: collection.name_c,
        slug: collection.slug_c,
        description: collection.description_c,
        image: collection.image_c,
        featured: collection.featured_c,
        productIds: collection.product_ids_c ? JSON.parse(collection.product_ids_c) : []
      };
    } catch (error) {
      console.error("Error fetching collection by slug:", error);
      return null;
    }
  },

  async getFeatured() {
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
          {"field": {"Name": "slug_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "image_c"}},
          {"field": {"Name": "featured_c"}},
          {"field": {"Name": "product_ids_c"}}
        ],
        where: [{"FieldName": "featured_c", "Operator": "EqualTo", "Values": [true]}]
      };

      const response = await apperClient.fetchRecords('collection_c', params);
      
      if (!response.success) {
        console.error("Error fetching featured collections:", response.message);
        return [];
      }

      return response.data.map(collection => ({
        Id: collection.Id,
        name: collection.name_c,
        slug: collection.slug_c,
        description: collection.description_c,
        image: collection.image_c,
        featured: collection.featured_c,
        productIds: collection.product_ids_c ? JSON.parse(collection.product_ids_c) : []
      }));
    } catch (error) {
      console.error("Error fetching featured collections:", error);
      return [];
    }
  },

  async getCollectionProducts(collectionId) {
    try {
      const collection = await this.getById(collectionId);
      if (!collection || !collection.productIds || collection.productIds.length === 0) {
        return [];
      }

      const allProducts = await productService.getAll();
      return allProducts.filter(p => collection.productIds.includes(p.Id.toString()));
    } catch (error) {
      console.error("Error fetching collection products:", error);
      return [];
    }
  },

  async create(collectionData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        records: [{
          name_c: collectionData.name,
          slug_c: collectionData.slug,
          description_c: collectionData.description,
          image_c: collectionData.image,
          featured_c: collectionData.featured || false,
          product_ids_c: JSON.stringify(collectionData.productIds || [])
        }]
      };

      const response = await apperClient.createRecord('collection_c', params);
      
      if (!response.success) {
        console.error("Error creating collection:", response.message);
        return null;
      }

      if (response.results && response.results[0] && response.results[0].success) {
        const created = response.results[0].data;
        return {
          Id: created.Id,
          name: created.name_c,
          slug: created.slug_c,
          description: created.description_c,
          image: created.image_c,
          featured: created.featured_c,
          productIds: created.product_ids_c ? JSON.parse(created.product_ids_c) : []
        };
      }

      return null;
    } catch (error) {
      console.error("Error creating collection:", error);
      return null;
    }
  },

  async update(id, updateData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const updateFields = {
        Id: parseInt(id)
      };

      if (updateData.name !== undefined) updateFields.name_c = updateData.name;
      if (updateData.slug !== undefined) updateFields.slug_c = updateData.slug;
      if (updateData.description !== undefined) updateFields.description_c = updateData.description;
      if (updateData.image !== undefined) updateFields.image_c = updateData.image;
      if (updateData.featured !== undefined) updateFields.featured_c = updateData.featured;
      if (updateData.productIds !== undefined) updateFields.product_ids_c = JSON.stringify(updateData.productIds);

      const params = {
        records: [updateFields]
      };

      const response = await apperClient.updateRecord('collection_c', params);
      
      if (!response.success) {
        console.error("Error updating collection:", response.message);
        return null;
      }

      if (response.results && response.results[0] && response.results[0].success) {
        const updated = response.results[0].data;
        return {
          Id: updated.Id,
          name: updated.name_c,
          slug: updated.slug_c,
          description: updated.description_c,
          image: updated.image_c,
          featured: updated.featured_c,
          productIds: updated.product_ids_c ? JSON.parse(updated.product_ids_c) : []
        };
      }

      return null;
    } catch (error) {
      console.error("Error updating collection:", error);
      return null;
    }
  },

  async delete(id) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        RecordIds: [parseInt(id)]
      };

      const response = await apperClient.deleteRecord('collection_c', params);
      
      if (!response.success) {
        console.error("Error deleting collection:", response.message);
        return null;
      }

      if (response.results && response.results[0] && response.results[0].success) {
        return { Id: parseInt(id) };
      }

      return null;
    } catch (error) {
      console.error("Error deleting collection:", error);
      return null;
    }
  }
};

export default collectionService;

export default collectionService;