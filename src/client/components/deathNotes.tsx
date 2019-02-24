import * as React from 'react';
import { State, DeathNote } from '../types';

const Note = ({ state, note }: { state: State; note: DeathNote }): JSX.Element => {
  let deadName: string | undefined;
  if (note.deadPlayerId === state.id) {
    deadName = state.name;
  } else {
    const deadPlayer = state.players.get(note.deadPlayerId);
    if (deadPlayer) {
      deadName = deadPlayer.name;
    }
  }

  let causeName: string | undefined;
  if (note.causePlayerId === state.id) {
    causeName = state.name;
  } else {
    const causePlayer = state.players.get(note.causePlayerId);
    if (causePlayer) {
      causeName = causePlayer.name;
    }
  }

  if (!deadName || !causeName) {
    return <div />;
  }

  return (
    <div>
      <span style={{ color: '#ff0000' }}>{causeName}</span> kill{' '}
      <span style={{ color: '#0000ff' }}>{deadName}</span>
    </div>
  );
};

interface Props {
  state: State;
}

export class DeathNotes extends React.Component<Props, any> {
  public render() {
    const { state } = this.props;

    return (
      <div
        style={{
          position: 'absolute',
          top: '0',
          right: '0',
          zIndex: 200,
        }}
      >
        {state.deathNotes.map((note, i) => (
          <Note note={note} state={state} key={i} />
        ))}
      </div>
    );
  }
}
