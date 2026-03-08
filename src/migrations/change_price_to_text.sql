-- Change price column to text
alter table cars 
alter column price type text using price::text;
