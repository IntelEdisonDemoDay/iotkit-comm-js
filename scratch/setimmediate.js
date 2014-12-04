function myprint(arg1, arg2) {
  console.log(arg1);
  console.log(arg2);
  if (arg1 === "hello")
    setImmediate(myprint, "hi", "there");
}

myprint("hello", "world");
