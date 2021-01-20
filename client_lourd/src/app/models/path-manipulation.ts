import { Position } from './position';

const NOT_FOUND = -1;

export class PathManipulation {

  getFirstPosition(path: string): Position {
    path = path.substring(path.search(' ') + 1 , path.search('L') - 1);
    return new Position(+path.slice(0, path.search(' ')), +path.substring(path.search(' ')));
  }

  getPastPosition(path: string): Position {
    path = path.substring(0, path.lastIndexOf('L') - 1);
    if (path.search('L') === NOT_FOUND) {
      path = path.substring(path.search(' ') + 1 , path.length);
      return new Position(+path.slice(0, path.search(' ')), +path.substring(path.search(' ')));
    } else {
      path = path.substring(path.lastIndexOf('L') + 2);
    }
    return new Position(+path.slice(0, path.search(' ')), +path.substring(path.search(' ')));
  }

  getCurrentPosition(path: string): Position {
    path = path.substring(path.lastIndexOf('L') + 2);
    return new Position(+path.slice(0, path.search(' ')), +path.substring(path.search(' ')));
  }

  deleteLastPosition(path: string, pointDeleted: number): string {
    for (let i = 0 ; i < pointDeleted ; i++) {
      path = path.substring(0 , path.lastIndexOf('L'));
    }
    return path;
  }
}
