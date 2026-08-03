INSERT INTO categories (name)
SELECT v.name FROM (VALUES ('Food'), ('Utilities'), ('Cleaning'), ('Maintenance'), ('Others')) AS v(name)
WHERE NOT EXISTS (SELECT 1 FROM categories c WHERE c.name = v.name);
