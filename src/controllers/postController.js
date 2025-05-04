exports.searchPosts = async (req, res) => {
    try {
        const { keyword, category, sortBy } = req.query;
        
        let query = {};
        let sort = {};

        if (keyword) {
            query.$or = [
                { title: { $regex: keyword, $options: 'i' }},
                { content: { $regex: keyword, $options: 'i' }}
            ];
        }

        if (category) {
            query.category = category;
        }

        switch(sortBy) {
            case 'newest':
                sort.createdAt = -1;
                break;
            case 'oldest':
                sort.createdAt = 1;
                break;
            case 'popular':
                sort.commentCount = -1;
                break;
            default:
                sort.createdAt = -1;
        }

        const posts = await Post.find(query)
            .sort(sort)
            .populate('author', '_id name')
            .select('_id title content createdAt commentCount');

        res.json(posts);
    } catch (error) {
        res.status(500).json({
            error: 'Search failed',
            details: error.message
        });
    }
};