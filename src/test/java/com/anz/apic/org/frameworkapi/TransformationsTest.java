package com.anz.apic.org.frameworkapi;


import org.junit.runner.RunWith;

import de.helwich.junit.JasmineTest;
import de.helwich.junit.JasmineTestRunner;

@RunWith(JasmineTestRunner.class)
@JasmineTest(
    src =  { "lib/Require" },
    test = { "TransformationsTest"},
    browser = false
)
public class TransformationsTest {
}
