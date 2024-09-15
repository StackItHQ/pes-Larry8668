const supabase = require('../supabaseClient');

const logChange = async (req, res) => {
  const {
    sheet_id,
    rows_changed,
    prev_data,
    new_data,
    user_email,
    user_role,
    change_type,
    local_timestamp
  } = req.body;

  if (!sheet_id || !Array.isArray(rows_changed) || !Array.isArray(prev_data) || !Array.isArray(new_data) || !user_email || !change_type || !local_timestamp) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const { data, error } = await supabase
      .from('changes_log')
      .insert([{
        sheet_id,
        rows_changed,
        prev_data,
        new_data,
        user_email,
        user_role: user_role || null,
        change_type,
        local_timestamp,
        created_at: new Date() 
      }]);

    if (error) {
      throw error;
    }

    res.status(200).json({ success: true, message: "Change logged successfully", data });
  } catch (error) {
    console.error("Error logging change:", error);
    res.status(500).json({ error: "Failed to log change", details: error.message });
  }
};

module.exports = { logChange };
