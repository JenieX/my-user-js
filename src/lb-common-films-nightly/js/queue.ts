interface Item {
  type: 'type1' | 'type2',
  content: HTMLAnchorElement,
}

// type Queue<T> = T[] & { active: boolean };
interface Queue<T> extends Array<T> {
  active: boolean,
}

function createQueue<T>(): Queue<T> {
  const queue: Queue<T> = Object.assign([], { active: false });

  return queue;
}

const queue = createQueue<Item>();

function processItem({ type, content }: Item): void {
  console.log(type, content);
}

function processItems(): void {
  while (queue.length > 0) {
    const item = queue.shift()!;
    processItem(item);
  }
}

// queue.active = false;
// queue.active = true;
// const item = (queue[0] as Item).content;

const item: Item = {
  type: 'type1',
  content: document.querySelector('a')!,
};

if (queue.active === false) {
  queue.push(item);
} else {
  processItem(item);
}

export {
  processItem,
  processItems,
};

export default queue;
