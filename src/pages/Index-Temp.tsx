import { useState } from 'react';
import { tables, reducers } from '../module_bindings';
import { useSpacetimeDB, useTable, useReducer } from 'spacetimedb/react';
export default function Index() {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');

  const conn = useSpacetimeDB();
  const { isActive: connected } = conn;

  // Subscribe to all people in the database
  const [people] = useTable(tables.creator);

  const addReducer = useReducer(reducers.addCreator);

  const addPerson = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !connected) return;

    // Call the add reducer
    addReducer({ name: name, password: password });
    setName('');
    setPassword('');
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>SpacetimeDB React App</h1>

      <div style={{ marginBottom: '1rem' }}>
        Status:{' '}
        <strong style={{ color: connected ? 'green' : 'red' }}>
          {connected ? 'Connected' : 'Disconnected'}
        </strong>
      </div>

      <form onSubmit={addPerson} style={{ marginBottom: '2rem' }}>
        <input
          type="text"
          placeholder="Enter name"
          value={name}
          onChange={e => setName(e.target.value)}
          style={{ padding: '0.5rem', marginRight: '0.5rem' }}
          disabled={!connected}
        />
        <input
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          style={{ padding: '0.5rem', marginRight: '0.5rem' }}
          disabled={!connected}
        />
        <button
          type="submit"
          style={{ padding: '0.5rem 1rem' }}
          disabled={!connected}
        >
          Add Person
        </button>
      </form>

      <div>
        <h2>People ({people.length})</h2>
        {people.length === 0 ? (
          <p>No people yet. Add someone above!</p>
        ) : (
          <ul>
            {people.map((person, index) => (
              <li key={index}>{person.name}</li>
            ))}
          </ul>
        )}
      </div>
      {/*<img src='https://cdn.discordapp.com/attachments/1517940437829025793/1522193201916543017/Temp-Avatar.png?ex=6a479464&is=6a4642e4&hm=a960a2f4e639c2cd64886af0d4dacda10f30448e179bdf862dd18b79a057151c&'></img>*/}
    </div>
  );
}
