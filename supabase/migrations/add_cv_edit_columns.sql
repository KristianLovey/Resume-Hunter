-- Migration: Add CV editing and regeneration tracking columns
-- Purpose: Enable user edits to tailored CV, track edit timestamps, regeneration history

-- Add columns to applications table for CV editing
ALTER TABLE applications
ADD COLUMN IF NOT EXISTS tailored_cv_edited JSONB DEFAULT NULL COMMENT 'User-edited version of tailored CV (if null, use tailored_cv)',
ADD COLUMN IF NOT EXISTS edited_at TIMESTAMP WITH TIME ZONE DEFAULT NULL COMMENT 'When user last edited the tailored CV',
ADD COLUMN IF NOT EXISTS regenerated_at TIMESTAMP WITH TIME ZONE DEFAULT NULL COMMENT 'When the CV was last regenerated via AI refinement';

-- Create indexes for query performance
CREATE INDEX IF NOT EXISTS idx_applications_edited_at
ON applications(user_id, edited_at DESC);

CREATE INDEX IF NOT EXISTS idx_applications_regenerated_at
ON applications(user_id, regenerated_at DESC);

-- Add comment to applications table
COMMENT ON TABLE applications IS 'Job applications with tailored resumes, cover letters, and edit history';
