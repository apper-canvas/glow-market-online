const categoryService = {
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
          {"field": {"Name": "subcategories_c"}}
        ]
      };

      const response = await apperClient.fetchRecords('category_c', params);
      
      if (!response.success) {
        console.error("Error fetching categories:", response.message);
        return [];
      }

      return response.data.map(category => ({
        Id: category.Id,
        name: category.name_c,
        slug: category.slug_c,
        description: category.description_c,
        image: category.image_c,
        subcategories: category.subcategories_c ? JSON.parse(category.subcategories_c) : []
      }));
    } catch (error) {
      console.error("Error fetching categories:", error);
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
          {"field": {"Name": "subcategories_c"}}
        ]
      };

      const response = await apperClient.getRecordById('category_c', parseInt(id), params);
      
      if (!response.success || !response.data) {
        return null;
      }

      const category = response.data;
      return {
        Id: category.Id,
        name: category.name_c,
        slug: category.slug_c,
        description: category.description_c,
        image: category.image_c,
        subcategories: category.subcategories_c ? JSON.parse(category.subcategories_c) : []
      };
    } catch (error) {
      console.error("Error fetching category by ID:", error);
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
          {"field": {"Name": "subcategories_c"}}
        ],
        where: [{"FieldName": "slug_c", "Operator": "EqualTo", "Values": [slug]}]
      };

      const response = await apperClient.fetchRecords('category_c', params);
      
      if (!response.success || !response.data || response.data.length === 0) {
        return null;
      }

      const category = response.data[0];
      return {
        Id: category.Id,
        name: category.name_c,
        slug: category.slug_c,
        description: category.description_c,
        image: category.image_c,
        subcategories: category.subcategories_c ? JSON.parse(category.subcategories_c) : []
      };
    } catch (error) {
      console.error("Error fetching category by slug:", error);
      return null;
    }
  },

  async getSubcategories(categorySlug) {
    try {
      const category = await this.getBySlug(categorySlug);
      return category ? category.subcategories : [];
    } catch (error) {
      console.error("Error fetching subcategories:", error);
      return [];
    }
  },

  async create(categoryData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        records: [{
          name_c: categoryData.name,
          slug_c: categoryData.slug,
          description_c: categoryData.description,
          image_c: categoryData.image,
          subcategories_c: JSON.stringify(categoryData.subcategories || [])
        }]
      };

      const response = await apperClient.createRecord('category_c', params);
      
      if (!response.success) {
        console.error("Error creating category:", response.message);
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
          subcategories: created.subcategories_c ? JSON.parse(created.subcategories_c) : []
        };
      }

      return null;
    } catch (error) {
      console.error("Error creating category:", error);
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
      if (updateData.subcategories !== undefined) updateFields.subcategories_c = JSON.stringify(updateData.subcategories);

      const params = {
        records: [updateFields]
      };

      const response = await apperClient.updateRecord('category_c', params);
      
      if (!response.success) {
        console.error("Error updating category:", response.message);
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
          subcategories: updated.subcategories_c ? JSON.parse(updated.subcategories_c) : []
        };
      }

      return null;
    } catch (error) {
      console.error("Error updating category:", error);
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

      const response = await apperClient.deleteRecord('category_c', params);
      
      if (!response.success) {
        console.error("Error deleting category:", response.message);
        return null;
      }

      if (response.results && response.results[0] && response.results[0].success) {
        return { Id: parseInt(id) };
      }

      return null;
    } catch (error) {
      console.error("Error deleting category:", error);
      return null;
    }
  }
};

export default categoryService;
