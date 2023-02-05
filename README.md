# Welcome to Diar.io

- Ionic: 6.20.8
- AngularFire: 7.5

This is a 10-hour web competency project. I'll use this README.md to explain myself a little and discuss parts of the app that could be done in different ways.

# Notes

## Icons

I didn't get around to doing this, but I should have put icons on all the buttons and then use a media/container query to only show the icon on small screens, but show the text and icon on larger screens.

## BaseComponent

I like to have a BaseComponent (saved in `src/app/shared/components/base.component.ts`) which has a simple `addSubscriptions` method that takes a variable list of `Subscription` and handles correctly unsubscribing from them in the `ngOnDestroy` method.

## DataModels

I like to keep data model class definitions in a separate file to the service, I've found this reduces clutter. But equally you could move the `deserialize()` method into the service and keep the class definition file a bit slimmer.

## AngularFire syntax

It seems AngularFire has just been updated but its docs haven't. For example [it suggests](https://github.com/angular/angularfire#example-use) to fetch a collection using the syntax ...

```
constructor(firestore: Firestore) {
    const collection = collection(firestore, 'items');
    this.item$ = collectionData(collection);
};
```

but then its section on querying uses the older syntax like ...

```
constructor(firestore: AngularFirestore) {
    this.items = firestore.collection('items').valueChanges();
}
```

so it's been a little confusing!
