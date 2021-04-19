package com.example.client_leger.drawing.view

import android.content.res.ColorStateList
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModelProvider
import com.example.client_leger.R
import com.example.client_leger.databinding.FragmentDrawingBinding
import com.example.client_leger.drawing.viewModel.DrawingCanvasVM
import com.example.client_leger.drawing.viewModel.DrawingToolsVM
import com.skydoves.colorpickerview.listeners.ColorListener
import dagger.hilt.android.AndroidEntryPoint

@AndroidEntryPoint
class DrawingView : Fragment(R.layout.fragment_drawing) {

    val isEnabled: MutableLiveData<Boolean> = MutableLiveData(false)

    private lateinit var canvasVM : DrawingCanvasVM

    private lateinit var toolsVM : DrawingToolsVM

    private lateinit var binding: FragmentDrawingBinding

    private lateinit var previousColorButtons: List<View>

    override fun onCreateView(
            inflater: LayoutInflater,
            container: ViewGroup?,
            savedInstanceState: Bundle?
    ): View {
        binding = FragmentDrawingBinding.inflate(inflater, container, false)
        binding.lifecycleOwner = this
        canvasVM = ViewModelProvider(this).get(DrawingCanvasVM::class.java)
        toolsVM = ViewModelProvider(this).get(DrawingToolsVM::class.java)
        binding.drawingTools.viewmodel = toolsVM

        // create drawing canvas view
        val drawingCanvasView = DrawingCanvasView(requireContext(), null)
        drawingCanvasView.viewModel = canvasVM
        drawingCanvasView.top = 0
        drawingCanvasView.left = 0
        drawingCanvasView.layoutParams = ViewGroup.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT)
        binding.frameLayout.addView(drawingCanvasView)

        // set up color picker
        binding.drawingTools.colorPickerView.setColorListener(ColorListener { color, _ ->
            onColorPickerChanged(color)
        })
        binding.drawingTools.colorPickerView.attachAlphaSlider(binding.drawingTools.alphaSlideBar)
        binding.drawingTools.colorPickerView.attachBrightnessSlider(binding.drawingTools.brightnessSlide)
        binding.drawingTools.colorPickerView.setInitialColor(canvasVM.drawingOptions.color)

        // set up previous color buttons, cant bind backgroundTint so doing it manually
        previousColorButtons = listOf(binding.drawingTools.lastColor1, binding.drawingTools.lastColor2,
            binding.drawingTools.lastColor3, binding.drawingTools.lastColor4, binding.drawingTools.lastColor5,
            binding.drawingTools.lastColor6, binding.drawingTools.lastColor7, binding.drawingTools.lastColor8,
            binding.drawingTools.lastColor9)
        val clickListener = View.OnClickListener { view ->
            onPreviousColorClicked(view)
        }
        previousColorButtons.forEach { it.setOnClickListener(clickListener) }
        toolsVM.previousColors.forEachIndexed{ index, it -> it.observe(viewLifecycleOwner, { updatePreviousColor(index, it) }) }
        canvasVM.drawing.observe(viewLifecycleOwner, { if(it) toolsVM.onDrawingStarted() })

        // set up grid options
        toolsVM.gridStep.observe(viewLifecycleOwner, { drawingCanvasView.recreateGrid() })
        toolsVM.gridOpacity.observe(viewLifecycleOwner, { drawingCanvasView.invalidate() })
        toolsVM.gridVisible.observe(viewLifecycleOwner, { drawingCanvasView.invalidate() })

        // set up enabling/disabling drawing controls
        isEnabled.observe(viewLifecycleOwner, {
            drawingCanvasView.isEnabled = it
            toolsVM.isEnabled.value = it
        })

        return binding.root
    }

    fun reset() {
        canvasVM.resetAll()
        toolsVM.reset()
    }

    private fun onColorPickerChanged(color: Int) {
        toolsVM.onSelectedColorChanged(color)
        binding.drawingTools.alphaTileView.setPaintColor(color)
    }

    private fun onPreviousColorClicked(view: View) {
        view.foregroundTintList?.let {
            toolsVM.onSelectedColorChanged(it.defaultColor)
            binding.drawingTools.colorPickerView.selectByHsvColor(it.defaultColor)
        }
    }

    private fun updatePreviousColor(index: Int, color: Int) {
        previousColorButtons[index].foregroundTintList = ColorStateList.valueOf(color)
    }
}