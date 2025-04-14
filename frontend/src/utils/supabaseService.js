import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Projects
const fetchProjects = async () => {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data;
};

const getActiveProject = async () => {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('is_active', true)
    .single();
  
  if (error && error.code !== 'PGRST116') throw error; // PGRST116 is "no rows returned"
  return data || null;
};

const createProject = async (project) => {
  const { data, error } = await supabase
    .from('projects')
    .insert([project])
    .select();
  
  if (error) throw error;
  return data[0];
};

const updateProject = async (id, updates) => {
  const { data, error } = await supabase
    .from('projects')
    .update(updates)
    .eq('id', id)
    .select();
  
  if (error) throw error;
  return data[0];
};

const setProjectActive = async (id) => {
  // First deactivate all projects
  const { error: deactivateError } = await supabase
    .from('projects')
    .update({ is_active: false })
    .neq('id', 0); // Update all projects
  
  if (deactivateError) throw deactivateError;
  
  // Then activate the specified project
  const { data, error } = await supabase
    .from('projects')
    .update({ is_active: true })
    .eq('id', id)
    .select();
  
  if (error) throw error;
  return data[0];
};

// API Keys
const getApiKeys = async () => {
  const { data, error } = await supabase
    .from('user_settings')
    .select('*')
    .single();
  
  if (error) throw error;
  return data;
};

const updateApiKeys = async (keys) => {
  const { data, error } = await supabase
    .from('user_settings')
    .update(keys)
    .eq('id', 1) // Use the first row
    .select();
  
  if (error) throw error;
  return data[0];
};

// Companies
const fetchCompanies = async (projectId) => {
  const { data, error } = await supabase
    .from('companies')
    .select(`
      *,
      generated_emails (*)
    `)
    .eq('project_id', projectId)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data;
};

const createCompany = async (company) => {
  const { data, error } = await supabase
    .from('companies')
    .insert([company])
    .select();
  
  if (error) throw error;
  return data[0];
};

const updateCompany = async (id, updates) => {
  const { data, error } = await supabase
    .from('companies')
    .update(updates)
    .eq('id', id)
    .select();
  
  if (error) throw error;
  return data[0];
};

const deleteCompany = async (id) => {
  const { error } = await supabase
    .from('companies')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
  return true;
};

// Generated Emails
const createGeneratedEmail = async (email) => {
  const { data, error } = await supabase
    .from('generated_emails')
    .insert([email])
    .select();
  
  if (error) throw error;
  return data[0];
};

const updateGeneratedEmail = async (id, updates) => {
  const { data, error } = await supabase
    .from('generated_emails')
    .update(updates)
    .eq('id', id)
    .select();
  
  if (error) throw error;
  return data[0];
};

// Sent Emails
const fetchSentEmails = async () => {
  const { data, error } = await supabase
    .from('sent_emails')
    .select('*')
    .order('sent_at', { ascending: false });
  
  if (error) throw error;
  return data;
};

const createSentEmail = async (email) => {
  const { data, error } = await supabase
    .from('sent_emails')
    .insert([email])
    .select();
  
  if (error) throw error;
  return data[0];
};

export {
  // Projects
  fetchProjects,
  getActiveProject,
  createProject,
  updateProject,
  setProjectActive,
  
  // API Keys
  getApiKeys,
  updateApiKeys,
  
  // Companies
  fetchCompanies,
  createCompany,
  updateCompany,
  deleteCompany,
  
  // Generated Emails
  createGeneratedEmail,
  updateGeneratedEmail,
  
  // Sent Emails
  fetchSentEmails,
  createSentEmail
}; 