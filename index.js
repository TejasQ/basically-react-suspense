/** Just some utils */
const cache = new Map(); // A central cache.
const randomBreedIndex = Math.floor(Math.random() * 88) + 1; // Just a random number.
const render = value => (document.querySelector("#root").innerHTML = value); // Fake "render".

/**
 * An object to create a "resource" which can be
 * read (and in the future) preloaded, etc.
 */
const createResource = (getStuff, key) => ({
  read: () => {
    const finalValue = cache.get(key);

    if (!finalValue) {
      const promise = getStuff();
      throw { key, promise };
    }

    return finalValue;
  },
});

/** A "component" that gets a random dog */
const getRandomDog = () => {
  const resource = createResource(
    () =>
      fetch("https://dog.ceo/api/breeds/list")
        .then(r => r.json())
        .then(listResponse => {
          return listResponse.message;
        }),
    "breeds",
  );

  return resource.read()[randomBreedIndex];
};

/** A "component" that gets an image of a given dog */
const getDogImageByBreed = breed => {
  const imageResource = createResource(
    () =>
      fetch(`https://dog.ceo/api/breed/${breed}/images`)
        .then(r => r.json())
        .then(listResponse => {
          return listResponse.message[0];
        }),
    `${breed}-image`,
  );

  return imageResource.read();
};

/**
 * Bring it all together. This is likely what React does
 * under the hood or similar.
 */
const start = async () => {
  /**
   * This will throw _internally_ and be handled
   * in the catch block if we don't have data yet.
   */
  try {
    const breed = getRandomDog(); // async, but not really.

    return render(`
      Your random dog breed is <strong>${breed}</strong>!<br />
      Here's an image:<br />
      <br />

      <!-- line below is INLINE! async but not really -->
      <img alt="${breed}" src="${getDogImageByBreed(breed)}" /><br />

      <br />
      Love you, <br />
      <a target="_blank" href="https://twitter.com/tejaskumar_">tejas</a>`);

    /**
     * When we catch a resource (because we don't have data yet!)
     */
  } catch (maybePendingResource) {
    // If it's an actual resource and it's a promise,
    if (maybePendingResource.promise && maybePendingResource.promise instanceof Promise) {
      // Pause and set its final value in the cache
      cache.set(maybePendingResource.key, await maybePendingResource.promise);

      // Recursively do this until our "renderer" returns before coming here.
      start();

      // If it's not a resource, it must be a real error! Let's throw it!
    } else {
      throw maybePendingResource;
    }
  }
};

start();
