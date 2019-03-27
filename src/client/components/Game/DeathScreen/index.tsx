import * as React from 'react';
import { GameStats } from '../../gameStats';
import styles from './index.css';
import classNames from 'classnames';
import { RadarLoader } from '../../RadarLoader';

interface Props {
  game: any;
  restart: any;
}

interface State {
  isRestartDisabled: boolean;
}

export class DeathScreen extends React.PureComponent<Props, State> {
  public state: State = {
    isRestartDisabled: true,
  };

  public render() {
    const { game, restart } = this.props;
    const { isRestartDisabled } = this.state;

    const restartButtonClass = classNames({
      [styles.restartButton]: true,
      [styles.isRestartDisabled]: isRestartDisabled,
    });

    return (
      <div className={styles.deathScreen}>
        <div className={styles.topContainer}>
          <div className={styles.logo} />
          <RadarLoader withTimer timeFinish={this.timeFinish} />
        </div>
        <div className={styles.deathContent}>
          <div className={styles.box}>
            <div className={styles.stats}>
              <div>ПОТРАЧЕНО!</div>
              <GameStats players={game.players} />
            </div>
            <button className={restartButtonClass} onClick={restart}>
              Restart
            </button>
          </div>
        </div>
      </div>
    );
  }

  private timeFinish = () => this.setState({ isRestartDisabled: false });
}
