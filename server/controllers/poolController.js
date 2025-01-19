// server/controllers/poolController.js

const Pool = require('../models/Pool');

/**
 * Get all pools
 */
exports.getAllPools = async (req, res) => {
    try {
        const pools = await Pool.find({});
        return res.json({ success: true, data: pools });
    } catch (err) {
        console.error('[getAllPools] Error:', err);
        return res.status(500).json({ success: false, error: 'Server error' });
    }
};

/**
 * Get a single pool by ID
 */
exports.getPoolById = async (req, res) => {
    try {
        const { id } = req.params;
        const pool = await Pool.findById(id);
        if (!pool) {
            return res.status(404).json({ success: false, error: 'Pool not found' });
        }
        return res.json({ success: true, data: pool });
    } catch (err) {
        console.error('[getPoolById] Error:', err);
        return res.status(500).json({ success: false, error: 'Server error' });
    }
};
