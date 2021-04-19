//CLEAR ALL EXISTING
MATCH (n)
WITH n LIMIT 10000
OPTIONAL MATCH (n)-[r]->()
DELETE n,r;

// NODES
LOAD CSV WITH HEADERS FROM "file:///person_node.csv" AS r FIELDTERMINATOR ';'
CREATE (p:Person {
  id: toInteger(r.`id:ID(Person)`),
  name: r.name,
  born: toInteger(r.`born:int`)
});

LOAD CSV WITH HEADERS FROM "file:///movie_node.csv" AS r FIELDTERMINATOR ';'
CREATE (m:Movie {
  id: toInteger(r.`id:ID(Movie)`),
  title: r.title,
  tagline: r.tagline,
  summary: r.summary,
  poster_image: r.poster_image,
  duration: toInteger(r.`duration:int`),
  rated: r.rated
});

LOAD CSV WITH HEADERS FROM "file:///book_node.csv" AS r FIELDTERMINATOR ';'
CREATE (m:Book {
  id: toInteger(r.`id:ID(Book)`),
  title: r.title,
  tagline: r.tagline,
  summary: r.summary,
  poster_image: r.poster_image,
  duration: toInteger(r.`duration:int`),
  rated: r.rated
});

LOAD CSV WITH HEADERS FROM "file:///genre_node.csv" AS r FIELDTERMINATOR ';'
CREATE (g:Genre {
  id: toInteger(r.`id:ID(Genre)`),
  name: r.name
});

// RELATIONSHIPS
LOAD CSV WITH HEADERS FROM "file:///directed_rels.csv" AS r FIELDTERMINATOR ';'
MATCH (p:Person {id: toInteger(r.`:START_ID(Person)`)}), (m:Movie {id: toInteger(r.`:END_ID(Movie)`)})
CREATE (p)-[:DIRECTED]->(m);

LOAD CSV WITH HEADERS FROM "file:///acted_in_rels.csv" AS r FIELDTERMINATOR ';'
MATCH (p:Person {id: toInteger(r.`:START_ID(Person)`)}), (m:Movie {id: toInteger(r.`:END_ID(Movie)`)})
CREATE (p)-[:ACTED_IN{role:SPLIT(r.role, '/')}]->(m);

LOAD CSV WITH HEADERS FROM "file:///writer_of_movie_rels.csv" AS r FIELDTERMINATOR ';'
MATCH (p:Person {id: toInteger(r.`:START_ID(Person)`)}), (m:Movie {id: toInteger(r.`:END_ID(Movie)`)})
CREATE (p)-[:WRITER_OF_MOVIE]->(m);

LOAD CSV WITH HEADERS FROM "file:///writer_of_book_rels.csv" AS r FIELDTERMINATOR ';'
MATCH (p:Person {id: toInteger(r.`:START_ID(Person)`)}), (m:Book {id: toInteger(r.`:END_ID(Book)`)})
CREATE (p)-[:WRITER_OF_BOOK]->(m);

LOAD CSV WITH HEADERS FROM "file:///has_genre_movie_rels.csv" AS r FIELDTERMINATOR ';'
MATCH (m:Movie {id: toInteger(r.`:START_ID(Movie)`)}), (g:Genre {id: toInteger(r.`:END_ID(Genre)`)})
CREATE (m)-[:HAS_GENRE_MOVIE]->(g);

LOAD CSV WITH HEADERS FROM "file:///has_genre_book_rels.csv" AS r FIELDTERMINATOR ';'
MATCH (m:Book {id: toInteger(r.`:START_ID(Book)`)}), (g:Genre {id: toInteger(r.`:END_ID(Genre)`)})
CREATE (m)-[:HAS_GENRE_BOOK]->(g);

LOAD CSV WITH HEADERS FROM 'file:///ratings_movie.csv' AS line
MATCH (m:Movie {id:toInteger(line.movie_id)})  
MERGE (u:User {id:line.user_id, username:line.user_username}) // user ids are strings
CREATE (u)-[r:RATED_MOVIE]->(m)
SET r.rating = toInteger(line.rating)
SET r.review = line.review 
RETURN m.title, r.rating, u.username;

LOAD CSV WITH HEADERS FROM 'file:///ratings_book.csv' AS line
MATCH (m:Book {id:toInteger(line.book_id)})  
MERGE (u:User {id:line.user_id, username:line.user_username}) // user ids are strings
CREATE (u)-[r:RATED_BOOK]->(m)
SET r.rating = toInteger(line.rating)
SET r.review = line.review 
RETURN m.title, r.rating, u.username;

LOAD CSV WITH HEADERS FROM 'file:///likings_genre.csv' AS line
MATCH (u:User {id:line.user_id, username:line.user_username}), (g:Genre {id: toInteger(line.`:END_ID(Genre)`)})
CREATE (u)-[r:LIKES_GENRE]->(m);

LOAD CSV WITH HEADERS FROM 'file:///following.csv' AS line
MATCH (u1:User {id:line.user_id1}), (u2:User {id:line.user_id2})
CREATE (u1)-[r:FOLLOWING]->(u2);